type ConditionMapping = {
  pt_BR: Record<number, any>
}

export const WEATHER_CONDITION: ConditionMapping = {
  pt_BR: {
    200: { main: "Trovoada", description: "trovoada com chuva leve" },
    201: { main: "Trovoada", description: "trovoada com chuva" },
    202: { main: "Trovoada", description: "trovoada com chuva forte" },
    210: { main: "Trovoada", description: "trovoada leve" },
    211: { main: "Trovoada", description: "trovoada" },
    212: { main: "Trovoada", description: "trovoada forte" },
    221: { main: "Trovoada", description: "trovoada irregular" },
    230: { main: "Trovoada", description: "trovoada com garoa leve" },
    231: { main: "Trovoada", description: "trovoada com garoa" },
    232: { main: "Trovoada", description: "trovoada com garoa forte" },
  
    300: { main: "Garoa", description: "garoa de intensidade leve" },
    301: { main: "Garoa", description: "garoa" },
    302: { main: "Garoa", description: "garoa de intensidade forte" },
    310: { main: "Garoa", description: "chuva leve com garoa" },
    311: { main: "Garoa", description: "chuva com garoa" },
    312: { main: "Garoa", description: "chuva forte com garoa" },
    313: { main: "Garoa", description: "chuva com garoa moderada" },
    314: { main: "Garoa", description: "chuva forte com garoa moderada" },
    321: { main: "Garoa", description: "chuva com garoa intensa" },
  
    500: { main: "Chuva", description: "chuva leve" },
    501: { main: "Chuva", description: "chuva moderada" },
    502: { main: "Chuva", description: "chuva de alta intensidade" },
    503: { main: "Chuva", description: "chuva muito forte" },
    504: { main: "Chuva", description: "chuva extrema" },
    511: { main: "Chuva", description: "chuva congelante" },
    520: { main: "Chuva", description: "chuva leve e intermitente" },
    521: { main: "Chuva", description: "chuva intermitente" },
    522: { main: "Chuva", description: "chuva intermitente e forte" },
    531: { main: "Chuva", description: "chuva intermitente e irregular" },
  
    600: { main: "Neve", description: "neve leve" },
    601: { main: "Neve", description: "neve" },
    602: { main: "Neve", description: "neve pesada" },
    611: { main: "Neve", description: "neve derretida" },
    612: { main: "Neve", description: "chuva leve com neve" },
    613: { main: "Neve", description: "chuva com neve" },
    615: { main: "Neve", description: "chuva leve e neve" },
    616: { main: "Neve", description: "chuva e neve" },
    620: { main: "Neve", description: "neve leve e intermitente" },
    621: { main: "Neve", description: "neve intermitente" },
    622: { main: "Neve", description: "neve intermitente e forte" },
  
    701: { main: "Névoa", description: "névoa" },
    711: { main: "Fumaça", description: "fumaça" },
    721: { main: "Bruma", description: "bruma" },
    731: { main: "Poeira", description: "redemoinhos de areia/pó" },
    741: { main: "Nevoeiro", description: "nevoeiro" },
    751: { main: "Areia", description: "areia" },
    761: { main: "Poeira", description: "pó" },
    762: { main: "Cinzas", description: "cinzas vulcânicas" },
    771: { main: "Rajada", description: "rajadas de vento" },
    781: { main: "Tornado", description: "tornado" },
  
    800: { main: "Limpo", description: "céu limpo" },
  
    801: { main: "Nuvens", description: "poucas nuvens: 11-25%" },
    802: { main: "Nuvens", description: "nuvens dispersas: 25-50%" },
    803: { main: "Nuvens", description: "nuvens fragmentadas: 51-84%" },
    804: { main: "Nuvens", description: "nuvens encobertas: 85-100%" },
  }
}
