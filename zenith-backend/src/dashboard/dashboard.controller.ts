import { Controller, Get, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('status-distribution')
  getStatusDistribution(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.dashboardService.getStatusDistribution(projectId, userId);
  }

  @Get('burndown')
  getBurndownData(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.dashboardService.getBurndownData(projectId, userId);
  }
}
