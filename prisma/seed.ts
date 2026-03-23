import { PrismaClient, ReportStatus, RoleName, UserStatus } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const roles = [RoleName.USER, RoleName.MODERATOR, RoleName.ADMIN]

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    })
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.ADMIN },
  })

  const moderatorRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.MODERATOR },
  })

  const userRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.USER },
  })

  const defaultPassword = await argon2.hash('ChangeMe123!')

  await prisma.user.upsert({
    where: { email: 'admin@confesionesec.local' },
    update: {},
    create: {
      email: 'admin@confesionesec.local',
      displayName: 'Platform Admin',
      passwordHash: defaultPassword,
      roleId: adminRole.id,
      status: UserStatus.ACTIVE,
    },
  })

  await prisma.user.upsert({
    where: { email: 'moderator@confesionesec.local' },
    update: {},
    create: {
      email: 'moderator@confesionesec.local',
      displayName: 'Community Moderator',
      passwordHash: defaultPassword,
      roleId: moderatorRole.id,
      status: UserStatus.ACTIVE,
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@confesionesec.local' },
    update: {},
    create: {
      email: 'user@confesionesec.local',
      displayName: 'Community User',
      passwordHash: defaultPassword,
      roleId: userRole.id,
      status: UserStatus.ACTIVE,
    },
  })

  const categories = [
    {
      id: 'universities',
      slug: 'universidades',
      name: 'Universidades',
      description:
        'Confesiones de universidades, facultades, pasillos, aulas y todo lo que se comenta dentro del mundo academico.',
      accentColor: '#FF8C42',
    },
    {
      id: 'churches',
      slug: 'iglesias',
      name: 'Iglesias',
      description:
        'Historias, silencios, rumores y contradicciones dentro de comunidades de fe y congregaciones.',
      accentColor: '#1F7AE0',
    },
    {
      id: 'companies',
      slug: 'empresas',
      name: 'Empresas',
      description:
        'Confesiones del mundo laboral: oficina, pasillos, jefaturas, chats internos y cultura de trabajo.',
      accentColor: '#7B61FF',
    },
    {
      id: 'hospitals',
      slug: 'hospitales',
      name: 'Hospitales',
      description:
        'Relatos del entorno hospitalario, turnos, areas de espera, administracion y realidades de todos los dias.',
      accentColor: '#0F9D58',
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }

  const sections = [
    {
      id: 'espol',
      slug: 'espol',
      name: 'ESPOL',
      city: 'Guayaquil',
      categoryId: 'universities',
      accentColor: '#FF8C42',
      headline: 'Confesiones de la ESPOL',
      description: 'Historias, rumores y desahogos del entorno politécnico en Guayaquil.',
    },
    {
      id: 'ucg',
      slug: 'ucg',
      name: 'UCG',
      city: 'Guayaquil',
      categoryId: 'universities',
      accentColor: '#D46A6A',
      headline: 'Confesiones de la UCG',
      description:
        'Anecdotas, historias de pasillo y secretos que nacen dentro de la vida universitaria.',
    },
    {
      id: 'udla',
      slug: 'udla',
      name: 'UDLA',
      city: 'Quito',
      categoryId: 'universities',
      accentColor: '#F0B429',
      headline: 'Confesiones de la UDLA',
      description:
        'Conversaciones, tensiones y relatos que solo entienden quienes viven el ritmo universitario.',
    },
    {
      id: 'centro-cristiano-guayaquil',
      slug: 'centro-cristiano-guayaquil',
      name: 'Centro Cristiano de Guayaquil',
      city: 'Guayaquil',
      categoryId: 'churches',
      accentColor: '#1F7AE0',
      headline: 'Confesiones del Centro Cristiano de Guayaquil',
      description:
        'Historias de comunidad, liderazgo, emociones guardadas y conversaciones que rara vez salen completas.',
    },
    {
      id: 'casa-de-fe',
      slug: 'casa-de-fe',
      name: 'Casa de Fe',
      city: 'Guayaquil',
      categoryId: 'churches',
      accentColor: '#4F8DF5',
      headline: 'Confesiones de Casa de Fe',
      description:
        'Un espacio para lo que se comenta dentro y fuera del templo, entre dudas, fe y vida real.',
    },
    {
      id: 'casa-de-avivamiento',
      slug: 'casa-de-avivamiento',
      name: 'Casa de Avivamiento',
      city: 'Quito',
      categoryId: 'churches',
      accentColor: '#6FA8FF',
      headline: 'Confesiones de Casa de Avivamiento',
      description:
        'Relatos de comunidad, experiencias intensas y silencios que tambien forman parte de la vida espiritual.',
    },
    {
      id: 'corporacion-favorita',
      slug: 'corporacion-favorita',
      name: 'Corporacion Favorita',
      city: 'Quito',
      categoryId: 'companies',
      accentColor: '#7B61FF',
      headline: 'Confesiones de Corporacion Favorita',
      description:
        'Rumores de oficina, historias de trabajo y conversaciones que nacen en la rutina empresarial.',
    },
    {
      id: 'banco-guayaquil',
      slug: 'banco-guayaquil',
      name: 'Banco Guayaquil',
      city: 'Guayaquil',
      categoryId: 'companies',
      accentColor: '#8B73FF',
      headline: 'Confesiones de Banco Guayaquil',
      description:
        'Anecdotas del mundo corporativo, presiones internas y lo que no sale en los informes.',
    },
    {
      id: 'tia-matriz',
      slug: 'tia-matriz',
      name: 'Tia Matriz',
      city: 'Guayaquil',
      categoryId: 'companies',
      accentColor: '#9A86FF',
      headline: 'Confesiones de Tia Matriz',
      description:
        'Lo cotidiano del trabajo convertido en historias, confesiones y comentarios que todos escuchan.',
    },
    {
      id: 'iess-ceibos',
      slug: 'iess-ceibos',
      name: 'IESS Ceibos',
      city: 'Guayaquil',
      categoryId: 'hospitals',
      accentColor: '#0F9D58',
      headline: 'Confesiones del IESS Ceibos',
      description:
        'Historias, rumores y desahogos de quienes viven el ritmo del hospital y sus alrededores.',
    },
    {
      id: 'hospital-teodoro-maldonado',
      slug: 'hospital-teodoro-maldonado',
      name: 'Hospital Teodoro Maldonado',
      city: 'Guayaquil',
      categoryId: 'hospitals',
      accentColor: '#1BAA67',
      headline: 'Confesiones del Teodoro Maldonado',
      description:
        'Relatos del entorno hospitalario, turnos largos, historias intensas y conversaciones de todos los dias.',
    },
    {
      id: 'hospital-luis-vernaza',
      slug: 'hospital-luis-vernaza',
      name: 'Hospital Luis Vernaza',
      city: 'Guayaquil',
      categoryId: 'hospitals',
      accentColor: '#2DBA78',
      headline: 'Confesiones del Luis Vernaza',
      description:
        'Un espacio para hablar de la vida hospitalaria, sus tensiones, humanidad y realidades internas.',
    },
  ]

  for (const section of sections) {
    await prisma.community.upsert({
      where: { slug: section.slug },
      update: section,
      create: section,
    })
  }

  await prisma.report.updateMany({
    where: { status: ReportStatus.IN_REVIEW },
    data: { status: ReportStatus.OPEN },
  })
}

main()
  .catch(async (error) => {
    console.error('Seed failed', error)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
