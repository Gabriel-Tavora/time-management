
function hashSeed(seed) {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  return Math.abs(hash);
}

export const AVATAR_SERVICES = {
  dicebear: {
    name: "DiceBear",
    description: "Avatares estilizados e únicos baseados em seed",
    url: (seed, style = "avataaars") =>
      `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  },
  dicebearNotionists: {
    name: "DiceBear Notionists",
    description: "Avatares estilo Notion",
    url: (seed) =>
      `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`,
  },
  uiAvatars: {
    name: "UI Avatars",
    description: "Iniciais do nome com cor de fundo fixa por seed",
    url: (seed) =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=random&color=fff&size=200`,
  },
  pravatar: {
    name: "Pravatar",
    description: "Fotos reais de pessoas (70 imagens), fixas por seed",
    url: (seed) => `https://i.pravatar.cc/200?img=${(hashSeed(seed) % 70) + 1}`,
  },

};

const DEFAULT_SERVICE = "dicebear";


export function getAvatarUrl({ seed = "user", service = DEFAULT_SERVICE, style } = {}) {
  const selectedService = AVATAR_SERVICES[service];

  if (!selectedService) {
    console.warn(`Serviço de avatar "${service}" não encontrado. Usando ${DEFAULT_SERVICE}.`);
    return AVATAR_SERVICES[DEFAULT_SERVICE].url(seed, style);
  }

  return selectedService.url(seed, style);
}


export function getAvatarByUser(user, options = {}) {
  const seed = user?.id ?? user?.email ?? user?.name ?? "user";
  return getAvatarUrl({ ...options, seed: String(seed) });
}


export function listAvatarServices() {
  return Object.entries(AVATAR_SERVICES).map(([key, service]) => ({
    key,
    name: service.name,
    description: service.description,
    example: service.url("demo"),
  }));
}


const AVATAR_VARIANTS = [
  { label: "DiceBear Avataaars", service: "dicebear", style: "avataaars" },
  { label: "DiceBear Adventurer", service: "dicebear", style: "adventurer" },
  { label: "DiceBear Notionists", service: "dicebearNotionists" },
  { label: "UI Avatars (iniciais)", service: "uiAvatars" },
  { label: "Pravatar (foto)", service: "pravatar" },
];


export function generateAvatarOptions(seed = "user") {
  return AVATAR_VARIANTS.map(({ label, service, style }) => ({
    name: label,
    url: getAvatarUrl({ seed, service, style }),
  }));
}