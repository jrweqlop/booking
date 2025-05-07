import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
    // ... you will write your Prisma Client queries here
    const dataRoom = await prisma.room.createMany({
        data: [
            { name: "robotics arena" },
            { name: "Kids Robotics" },
            { name: "Maker room" },
            { name: "machine room" },
            { name: "lecture 1 room" },
            { name: "lecture 2 room" },
        ], skipDuplicates: true
    })

    console.log({ dataRoom })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })