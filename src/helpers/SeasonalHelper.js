export function getSeasonalContent() {
    const today = new Date();
    const year = today.getFullYear();
  
    // Configuración de etapas del año
    const seasons = [
      {
        name: "Halloween",
        start: new Date(year, 9, 1), // 1 de octubre
        end: new Date(year, 10, 20), // 20 de noviembre
        banner: "Halloweeen",
        community: "CommunityHalloween",
        banner_offert: "BannerOffertHalloween",
        product_offert: "ProductHalloween",
        about: "AboutHalloween"
      },
      {
        name: "Christmas",
        start: new Date(year, 10, 21), // 21 de noviembre
        end: new Date(year + 1, 0, 7), // 7 de enero
        banner: "Christmas",
        community: "CommunityChristmas",
        banner_offert: "BannerOffertChristmas",
        product_offert: "ProductChristmas",
        about: "AboutChristmas"
      },
      {
        name: "Default",
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
        banner: "Running",
        community: "CommunityRunning",
        banner_offert: "BannerOffertRunning",
        product_offert: "ProductRunning",
        about: "AboutRunning"

      },
    ];
  
    // Encuentra la temporada que corresponde a la fecha actual
    const currentSeason = seasons.find(
      (season) => today >= season.start && today <= season.end
    );
  
    // Devuelve el contenido correspondiente o un valor por defecto
    return currentSeason || {
      banner: "Running",
      community: "CommunityRunning",
      banner_offert: "BannerOffertRunning",
      product_offert: "ProductRunning",
      about: "AboutRunning",
    };
  }
  