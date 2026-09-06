/**
 * Las entradas del blog.
 *
 * TEXTO E IMÁGENES DE MUESTRA. Para publicar una entrada real:
 *  1. Sube la foto a `public/img/` (por ejemplo `public/img/oaxaca-01.jpg`).
 *  2. Copia uno de estos objetos, cambia `slug`, `title`, `body` y las rutas
 *     de `cover` y `gallery`.
 *  3. Guarda. La entrada aparece sola en la portada y en /historias.
 *
 * `slug` es la parte final de la dirección: /historias/<slug>. Debe ser único,
 * en minúsculas y sin acentos ni espacios.
 */
export type Photo = {
  src: string;
  /** Descripción para quien no puede ver la imagen. Siempre escríbela. */
  alt: string;
  caption?: string;
};

export type Post = {
  slug: string;
  title: string;
  /** Formato ISO: AAAA-MM-DD. Se usa para ordenar y para la fecha visible. */
  date: string;
  place?: string;
  /** Una o dos frases que se muestran en las tarjetas. */
  excerpt: string;
  cover: Photo;
  /** Cada string es un párrafo. */
  body: string[];
  /** Frase destacada que se intercala en el texto. Opcional. */
  pullQuote?: string;
  gallery?: Photo[];
};

export const posts: Post[] = [
  {
    slug: "el-mar-en-invierno",
    title: "El mar en invierno",
    date: "2024-01-14",
    place: "Puerto Escondido, Oaxaca",
    excerpt:
      "Manejamos toda la noche para llegar antes del amanecer. Él insistió en que valía la pena y, como casi siempre, tenía razón.",
    cover: {
      src: "/img/atardecer.svg",
      alt: "El sol bajo sobre el mar, el agua teñida de ámbar",
      caption: "La última luz del día, desde la playa vacía.",
    },
    body: [
      "Salimos a las once de la noche porque Iván decía que la carretera es de otro color cuando no hay nadie. Yo iba dormida en el asiento del copiloto y él iba cantando bajito, sin prender el radio, para no despertarme. Cuando abrí los ojos ya estaba amaneciendo y él tenía las dos manos en el volante y esa cara de quien está exactamente donde quiere estar.",
      "Llegamos con el mar todavía gris. No había nadie. Se quitó los tenis, los dejó tirados en la arena y caminó hasta que el agua le llegó a las rodillas, con todo y pantalón. Se quedó ahí parado un rato largo, de espaldas, mirando el horizonte. Cuando regresó nada más dijo: «Ya, ahora sí desayunamos».",
      "De ese viaje casi no hay fotos. Estábamos demasiado ocupados estando ahí. Las pocas que quedaron son estas, y las guardo como se guardan las cosas que no se pueden repetir.",
      "Enero en la costa es raro: hace calor pero el agua está fría y el pueblo está medio dormido. A él le gustaba así. Decía que los lugares se ven mejor cuando no están tratando de gustarte.",
    ],
    pullQuote:
      "«Los lugares se ven mejor cuando no están tratando de gustarte.»",
    gallery: [
      {
        src: "/img/mar.svg",
        alt: "Mar en calma bajo un cielo pálido de mañana",
        caption: "Las siete de la mañana. Todavía no llegaba nadie.",
      },
      {
        src: "/img/costa.svg",
        alt: "Acantilados oscuros recortados contra un cielo al atardecer",
        caption: "El mirador al que subimos el segundo día.",
      },
    ],
  },
  {
    slug: "la-carretera-a-real-de-catorce",
    title: "La carretera a Real de Catorce",
    date: "2023-11-02",
    place: "San Luis Potosí",
    excerpt:
      "Se le ponchó una llanta en medio del desierto y en lugar de enojarse se sentó a ver el atardecer. Así era.",
    cover: {
      src: "/img/desierto.svg",
      alt: "Dunas suaves de color ocre bajo un cielo cálido",
      caption: "El desierto a las seis de la tarde.",
    },
    body: [
      "Iba solo. Nos mandó una foto de la llanta ponchada y luego, veinte minutos después, una foto del cielo. Sin texto. Nada más el cielo.",
      "Cuando por fin llegó al pueblo ya era de noche y no había señal. Se metió a una fonda, cenó, y le contó a la señora que atendía toda la historia de la llanta. Nos enteramos porque tres años después volvimos juntos y la señora se acordaba de él. «El muchacho de la llanta», le dijo. Y él, feliz.",
      "Tenía ese don. Se bajaba del coche en un pueblo donde no conocía a nadie y a las dos horas ya sabía quién hacía el mejor pan y a qué hora abría la iglesia.",
      "Guardo el mapa que dibujó en una servilleta ese día. Está mal hecho, las distancias no cuadran, pero llegamos.",
    ],
    gallery: [
      {
        src: "/img/camino.svg",
        alt: "Un camino de tierra que se pierde entre colinas doradas",
        caption: "El tramo donde se quedó parado.",
      },
      {
        src: "/img/noche.svg",
        alt: "Cielo nocturno estrellado sobre montañas oscuras",
        caption: "Esa noche mandó esta foto y ya no contestó hasta el otro día.",
      },
    ],
  },
  {
    slug: "neblina-en-la-primavera",
    title: "Neblina en La Primavera",
    date: "2023-07-21",
    place: "Bosque de La Primavera, Jalisco",
    excerpt:
      "Su lugar de los domingos. Iba temprano, sin avisarle a nadie, y regresaba de otro humor.",
    cover: {
      src: "/img/bosque.svg",
      alt: "Cerros de pinos superpuestos, difuminados por la neblina",
      caption: "Domingo, siete y media de la mañana.",
    },
    body: [
      "No era un caminante serio. No tenía el equipo, no llevaba mapa, se iba en tenis. Pero se sabía las veredas de memoria y se enojaba de verdad cuando alguien dejaba basura.",
      "Decía que ahí pensaba mejor. Que el ruido de la ciudad se le quedaba pegado toda la semana y que dos horas de bosque se lo quitaban.",
      "Un domingo lo acompañé. Casi no habló en todo el camino, y yo, que soy de hablar, aprendí ese día que hay silencios que no hay que llenar.",
    ],
    pullQuote: "«Aquí se piensa mejor», me dijo. Y no dijo más en dos horas.",
    gallery: [
      {
        src: "/img/niebla.svg",
        alt: "Capas de cerros apenas visibles entre la niebla",
        caption: "Casi no se veía nada. A él le encantaba así.",
      },
    ],
  },
  {
    slug: "una-manana-cualquiera",
    title: "Una mañana cualquiera",
    date: "2023-04-09",
    place: "Casa",
    excerpt:
      "No todas las fotos son de viajes. Esta es de un martes, en la cocina, sin ningún motivo.",
    cover: {
      src: "/img/campo.svg",
      alt: "Campo dorado bajo una luz suave de mañana",
      caption: "La luz que entraba por la ventana de la cocina.",
    },
    body: [
      "Se levantaba temprano aunque no tuviera nada que hacer. Ponía café, abría la ventana y se quedaba ahí parado un rato, con la taza en la mano, sin prisa.",
      "Le tomé esta foto sin que se diera cuenta. Cuando la vio dijo que salía horrible y que la borrara. No la borré.",
      "Ahora pienso que las fotos que más me importan son estas: las que no eran de nada.",
    ],
  },
  {
    slug: "el-viaje-que-planeamos",
    title: "El viaje que planeamos",
    date: "2025-08-30",
    place: "En una libreta",
    excerpt:
      "Teníamos boletos para marzo. La libreta con el plan sigue en su cuarto, con su letra.",
    cover: {
      src: "/img/montana.svg",
      alt: "Cordillera azulada difuminándose en capas hacia el horizonte",
      caption: "El lugar al que íbamos a ir.",
    },
    body: [
      "Lo empezamos a planear en agosto, medio en broma. Para septiembre ya tenía una libreta con rutas, precios y una lista de cosas que quería ver, en orden de importancia. La número uno estaba subrayada dos veces.",
      "No hicimos ese viaje. Pero la libreta existe, y algún día voy a ir, y voy a llevarla.",
      "Si estás leyendo esto y alguna vez le prometiste un viaje: háganlo. En serio.",
    ],
    pullQuote:
      "Si alguna vez le prometiste un viaje a alguien: háganlo. En serio.",
    gallery: [
      {
        src: "/img/lago.svg",
        alt: "Un lago quieto reflejando un cielo claro",
        caption: "El número uno de su lista, subrayado dos veces.",
      },
    ],
  },
  {
    slug: "la-lista-de-canciones",
    title: "La lista de canciones",
    date: "2026-05-18",
    place: "",
    excerpt:
      "Armamos entre todos la lista que ponía en la carretera. Si te falta una, la puedes dejar en los comentarios.",
    cover: {
      src: "/img/amanecer.svg",
      alt: "Amanecer sobre cerros en capas, el cielo pasando de azul a ámbar",
      caption: "La hora a la que siempre salía a la carretera.",
    },
    body: [
      "Iván tenía una regla: el que maneja pone la música. Y como casi siempre manejaba él, casi siempre poníamos lo suyo.",
      "Después de marzo, sus amigos empezaron a mandarme canciones. «Esta la ponía siempre.» «Esta me la enseñó él.» Y se armó una lista larguísima que ahora escuchamos todos.",
      "Si te acuerdas de una que falta, déjala aquí abajo. Esta entrada es más de ustedes que mía.",
    ],
  },
];

/** Entradas de la más reciente a la más antigua. */
export const postsByDate = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Todas las fotos del sitio, para la página de galería. */
export const allPhotos: Array<Photo & { postSlug: string; postTitle: string }> =
  postsByDate.flatMap((post) =>
    [post.cover, ...(post.gallery ?? [])].map((photo) => ({
      ...photo,
      postSlug: post.slug,
      postTitle: post.title,
    }))
  );
