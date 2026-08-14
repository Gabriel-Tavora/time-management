const AVATAR_SERVICES = {
  dicebear: {
    name: "DiceBear",
    url: (seed, style = "avataaars") =>
      `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    description: "Avatares estilizados e únicos baseados em seed",
  },
  dicebearNotionists: {
    name: "DiceBear Notionists",
    url: (seed) =>
      `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`,
    description: "Avatares estilo Notion",
  },
  uiAvatars: {
    name: "UI Avatars",
    url: (seed) =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=random&color=fff&size=200`,
    description: "Iniciais do nome com cor de fundo aleatória",
  },
  pravatar: {
    name: "Pravatar",
    url: () => `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`,
    description: "Fotos reais de pessoas (70 imagens disponíveis)",
  },
  picsum: {
    name: "Picsum",
    url: () => `https://picsum.photos/seed/${Date.now()}/200/200`,
    description: "Imagens aleatórias do Lorem Picsum",
  },
};

export function getRandomAvatar(options = {}) {
  const {
    seed = "user",
    service = "dicebear",
    style = "avataaars",
  } = options;

  const selectedService = AVATAR_SERVICES[service];

  if (!selectedService) {
    console.warn(`Serviço de avatar "${service}" não encontrado. Usando DiceBear.`);
    return AVATAR_SERVICES.dicebear.url(seed, style);
  }

  return selectedService.url(seed, style);
}

export function getAvatarByUser(user) {
  return getRandomAvatar({
    seed: user?.id || user?.email || user?.name || "user",
    service: "dicebear",
  });
}

export function listAvatarServices() {
  return Object.entries(AVATAR_SERVICES).map(([key, value]) => ({
    key,
    name: value.name,
    description: value.description,
    example: value.url("demo"),
  }));
}

export function generateAvatarOptions(seed = "user") {
  return [
    { name: "DiceBear Avataaars", url: AVATAR_SERVICES.dicebear.url(seed, "avataaars") },
    { name: "DiceBear Adventurer", url: AVATAR_SERVICES.dicebear.url(seed, "adventurer") },
    { name: "DiceBear Notionists", url: AVATAR_SERVICES.dicebearNotionists.url(seed) },
    { name: "UI Avatars (Iniciais)", url: AVATAR_SERVICES.uiAvatars.url(seed) },
    { name: "Pravatar (Foto real)", url: AVATAR_SERVICES.pravatar.url() },
  ];
}

export { AVATAR_SERVICES };