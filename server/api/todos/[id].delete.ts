import { eq, and } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  // List todos for the current user
  const deletedTodo = await useDatabase().delete(tables.todos).where(and(
    eq(tables.todos.id, id),
    eq(tables.todos.userId, session.user.id)
  )).returning().get()

  if (!deletedTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }
  return deletedTodo
})