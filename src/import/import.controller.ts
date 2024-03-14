import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import')
export class ImportController {
    @Post()
    @UseInterceptors(FileInterceptor('importFile'))
    async import(@UploadedFile() file: Express.Multer.File) {
        const fileData = file.buffer.toString('utf8');
        console.log(fileData)
        return 'Imported';
    }
}
