import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
