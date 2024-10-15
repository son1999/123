import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities/log.entity';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) { }

  async logRequest(body: any): Promise<void> {
    const message = JSON.stringify(body);

    const log = this.logRepository.create({ message });
    await this.logRepository.save(log);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Logs');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Updated At', key: 'updated_at', width: 20 },
    ];

    worksheet.addRow({
      id: log.id,
      message: log.message,
      created_at: log.created_at,
      updated_at: log.updated_at,
    });

    const filePath = path.join(__dirname, '../../logs', `log_${Date.now()}.xlsx`);

    await workbook.xlsx.writeFile(filePath);
  }
}