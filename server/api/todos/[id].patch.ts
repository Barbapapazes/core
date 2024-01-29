import { eq, and } from 'drizzle-orm'
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  const { completed } = await useValidatedBody(event, {
    completed: z.number().int().min(0).max(1)
  })

  // List todos for the current user
  const todo = await useDatabase().update(tables.todos).set({
    completed
  }).where(and(
    eq(tables.todos.id, id),
    eq(tables.todos.userId, session.user.id)
  )).returning().get()

  return todo
})