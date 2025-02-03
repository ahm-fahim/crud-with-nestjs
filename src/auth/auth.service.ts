import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);
    //save the new user to the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // return back the user
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash: _, ...rest } = user;
      return rest;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential Taken');
        }
      }
      throw error;
    }
  }

  //Sign in
  async signin(dto: AuthDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credential incorrect');
    }
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect thro exception
    if (!pwMatches) {
      throw new ForbiddenException('Credential incorrect');
    }

    // send back the user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash: _, ...rest } = user;
    return rest;
  }
}
