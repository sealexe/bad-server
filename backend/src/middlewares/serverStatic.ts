import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    const root = path.resolve(baseDir)

    return (req: Request, res: Response, next: NextFunction) => {
        let decodedPath: string
        try {
            decodedPath = decodeURIComponent(req.path)
        } catch {
            return next()
        }

        // Определяем полный путь к запрашиваемому файлу
        const filePath = path.join(root, decodedPath)

        // Файл должен остаться внутри baseDir — иначе не отдаём
        if (filePath !== root && !filePath.startsWith(root + path.sep)) {
            return next()
        }

        // Проверяем, существует ли файл
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Файл не существует отдаем дальше мидлварам
                return next()
            }
            // Файл существует, отправляем его клиенту.
            // Имя файла — случайный uuid (см. middlewares/file.ts), при повторной
            // загрузке никогда не переиспользуется, поэтому долгий immutable-кэш безопасен.
            return res.sendFile(
                filePath,
                { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
                (sendErr) => {
                    if (sendErr) {
                        next(sendErr)
                    }
                }
            )
        })
    }
}
