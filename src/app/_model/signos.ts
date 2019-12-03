import { Paciente } from './paciente';

export class Signos{
    idSigno: number;
    paciente: Paciente;
    fecha: string;
    temperatura: string;
    pulso: number;
    ritmo_respiratorio: string;
}