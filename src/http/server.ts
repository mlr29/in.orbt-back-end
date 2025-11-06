import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { createCompletionRoute } from './routes/create-goal-completion'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// permite múltiplas origins separadas por vírgula na env FRONTEND_URL
const rawOrigins = process.env.FRONTEND_URL ?? '*'
const origins = rawOrigins === '*' ? '*' : rawOrigins.split(',').map(s => s.trim())

app.register(fastifyCors, {
  origin: origins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})
 
app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP Server running!')
  })
