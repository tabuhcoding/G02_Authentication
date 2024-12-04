// src/user/user.service.ts
import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      return { message: 'User registered successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(getUserDto: GetUserDto): Promise<{ token: string; user: { username: string; email: string } }> {
    const { email, password } = getUserDto;
  
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const payload = { username: user.username, email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
  
    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }
  

  async handleGoogleUser(profile: any): Promise<string> {
    const { googleId, email, fullName, avatar } = profile;
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      user = new this.userModel({
        googleId,
        email,
        fullName,
        avatar,
      });
      await user.save();
    }

    // Tạo JWT token
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
}