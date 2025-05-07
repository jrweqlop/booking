import { readFileSync, writeFileSync } from "fs";
import { join } from "path";


const WriteFile = async () => {
    const dataReadFile = readFileSync(join(process.cwd(), './prisma/schema.prisma'), 'utf8')
    console.log(dataReadFile)

    writeFileSync('../booking-api/prisma/schema.prisma', dataReadFile)
    console.log(dataReadFile)
}


WriteFile()