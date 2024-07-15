import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from './../prisma/prisma.service';
import { CriarGetMovimentacaoDTO } from './dto';

@Injectable()
export class MovimentacaoService {

    constructor(
        private prismaService:PrismaService
    ){}

    async getAllMovimentacoes(userId: number){
        return await this.prismaService.movimentacao.findMany({
            where: {
                userId:userId
            }
        })
    }

    async getMovimentacaoById(id: number){
        let movimentacao;
        try {
            movimentacao =  await this.prismaService.movimentacao.findUnique({
                where: {
                    id: id
                }
            })
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError
              ) {
                if (err.code === 'P2025') {
                  throw new NotFoundException(
                    'ID não encontrado',
                  );
                }
              } else {
                throw err;
              }
        }
        return movimentacao;
    }

    async createMovimentacoes(movimentacaoDto: CriarGetMovimentacaoDTO, id: number){
        let createdMovimentacao
        try {
            createdMovimentacao = await this.prismaService.movimentacao.create({
                data: {
                    entrada: movimentacaoDto.entrada,
                    saida: movimentacaoDto.saida,
                    conta: movimentacaoDto.conta ? movimentacaoDto.conta : '',
                    valor: movimentacaoDto.valor,
                    categoria: movimentacaoDto.categoria,
                    userId: id
                }
            })
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError
              ) {
                if (err.code === 'P2025') {
                  throw new ConflictException(
                    'Não foi possivel criar, verifique se a movimentação já existe.',
                  );
                }
              } else {
                throw err;
              }
        }

        return createdMovimentacao;
    }

    async updateMovimentacoesById(movimentacaoDto:CriarGetMovimentacaoDTO, id:number){

        let data = {}
        let updatedMovimentacao;

        //refatorar para usar Object Keys;
        if(movimentacaoDto.entrada){
            data['entrada'] = movimentacaoDto.entrada
        }

        if(movimentacaoDto.saida){
            data['saida'] = movimentacaoDto.saida
        }

        if(movimentacaoDto.conta){
            data['conta'] = movimentacaoDto.conta
        }

        if(movimentacaoDto.valor){
            data['valor'] = movimentacaoDto.valor
        }

        if(movimentacaoDto.categoria){
            data['categoria'] = movimentacaoDto.categoria
        }

        try{
            updatedMovimentacao = await this.prismaService.movimentacao.update({
                data: data,
                where:{
                    id: id
                }
            })
            console.log(updatedMovimentacao)
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError
              ) {
                if (err.code === 'P2025') {
                  throw new NotFoundException(
                    'ID não encontrado',
                  );
                }
              } else {
                throw err;
              }
        }

        return updatedMovimentacao;
        
    }

    async apagaMovimentacoesById(id: number){
        let movimentacaoExcluida;

        try {
            movimentacaoExcluida = await this.prismaService.movimentacao.delete({
                where: {
                    id: id
                }
            })
        } catch (err) {
            throw err;
        }
        return movimentacaoExcluida
    }

}
