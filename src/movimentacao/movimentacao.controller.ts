import { JwtGuard } from 'src/auth/guard';
import { MovimentacaoService } from './movimentacao.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CriarGetMovimentacaoDTO, EditarMovimentacaoDTO } from './dto';

@Controller('movimentacao')
export class MovimentacaoController {

    constructor(private movimentacaoService: MovimentacaoService){}

    @UseGuards(JwtGuard)
    @Get('')
    getAllMovimentacoes(@Req() req: any) {
        return this.movimentacaoService.getAllMovimentacoes(req.user.id)
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    getMovimentacaoById(@Param('id', ParseIntPipe) id: number) {
        return this.movimentacaoService.getMovimentacaoById(id)
    }

    @UseGuards(JwtGuard)
    @Post('')
    createMovimentacoes(@Body() dto: CriarGetMovimentacaoDTO, @Req() req: any ) { 
        return this.movimentacaoService.createMovimentacoes(dto, req.user.id)
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    putMovimentacoesById(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarMovimentacaoDTO ) {
        return this.movimentacaoService.updateMovimentacoesById(dto,id)
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    deleteMovimentacoesById(@Param('id', ParseIntPipe) id: number) {
        return this.movimentacaoService.apagaMovimentacoesById(id)
    }


}
