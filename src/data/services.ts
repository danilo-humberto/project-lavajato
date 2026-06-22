import type { CarSize, CarSizeOption, ExtraService, WashType, WashTypeOption } from "../types/service";

export const washPrices: Record<CarSize, Record<WashType, number>> = {
  large: {
    complete: 80,
    simple: 60,
  },
  medium: {
    complete: 70,
    simple: 50,
  },
  small: {
    complete: 60,
    simple: 40,
  },
  motorcycle: {
    complete: 60,
    simple: 40,
  },
};

export const carSizes: CarSizeOption[] = [
  {
    id: "large",
    label: "Carro grande",
    example: "SUVs, caminhonetes",
  },
  {
    id: "medium",
    label: "Carro médio",
    example: "Sedans, hatch médios",
  },
  {
    id: "small",
    label: "Carro pequeno",
    example: "Hatchs, compactos",
  },
  {
    id: "motorcycle",
    label: "Moto",
    example: "Scooters e motocicletas",
  },
];

export const washTypes: WashTypeOption[] = [
  {
    id: "complete",
    label: "Lavagem completa",
    description: "Lavagem completa, polimento e secagem com produtos da Vonixx.",
  },
  {
    id: "simple",
    label: "Lavagem simples",
    description: "Lavagem externa, secagem e aspiração com produtos da Vonixx.",
  },
];

export const extraServices: ExtraService[] = [
  {
    id: "seat-wash",
    title: "Lavagem dos bancos",
    description: "Higienização completa dos bancos.",
    price: 200,
  },
  {
    id: "roof-wash",
    title: "Lavagem do teto",
    description: "Limpeza interna do teto do veículo.",
    price: 100,
  },
  {
    id: "underbody-wash",
    title: "Lavagem da carroceria",
    description: "Lavagem da parte inferior do carro.",
    price: 200,
  },
];
