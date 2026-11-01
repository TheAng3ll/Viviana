/**
 * Las entradas del blog.
 *
 * Para publicar una entrada nueva:
 *  1. Sube la foto a `public/img/` y anota sus medidas en `content/photos.ts`.
 *  2. Copia uno de estos objetos, cambia `slug`, `title`, `body`, `cover` y
 *     `gallery`. Cada foto se escribe con `photo("nombre", "descripción", "pie")`.
 *  3. Guarda. La entrada aparece sola en la portada, en /historias y en /galeria.
 *
 * `slug` es la parte final de la dirección: /historias/<slug>. Debe ser único,
 * en minúsculas y sin acentos ni espacios.
 *
 * `order` decide en qué lugar sale cada entrada (1 es la primera). La fecha es
 * opcional: sólo ponla si la sabes.
 */
import { photo, type Photo } from "@/content/photos";

export type { Photo } from "@/content/photos";

export type Post = {
  slug: string;
  title: string;
  /** Posición en la lista. 1 es la primera. */
  order: number;
  /** Formato ISO: AAAA-MM-DD. Opcional; si no se sabe, se omite. */
  date?: string;
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
    slug: "ser-alteno",
    title: "Ser alteño",
    order: 1,
    place: "Los Altos de Jalisco",
    excerpt:
      "Sombrero, camisa blanca y botas. Un letrero atrás que lo decía por él: qué chulada ser alteño.",
    cover: photo(
      "alteno-sofa",
      "Iván sentado en un sofá de piel con sombrero blanco, camisa blanca y botas, frente a un muro de palmas secas y un letrero de neón que dice «Qué chulada ser alteño»",
      "El letrero lo dice todo."
    ),
    body: [
      "El letrero del fondo lo dice mejor que nosotros: qué chulada ser alteño. Iván se lo tomaba en serio y con gusto. El sombrero, la camisa blanca, las botas. No era disfraz; era de donde venía.",
      "Las fotos son de fiesta en los Altos. Solo en el sofá, mirando a un lado como si no le importara la cámara. Luego con compañía, ya con la lengua de fuera y las manos haciendo señas. Y de noche en las gradas, con todo el pueblo alrededor y los sombreros blancos por todos lados.",
      "Las guardamos juntas porque así se ve mejor: él, en su tierra, rodeado de gente.",
    ],
    pullQuote: "«Qué chulada ser alteño.»",
    gallery: [
      photo(
        "alteno-grupo",
        "Iván en el mismo sofá, con sombrero, sacando la lengua y haciendo señas con las manos, acompañado de dos mujeres vestidas de negro",
        "El mismo sofá, ya con compañía."
      ),
      photo(
        "alteno-gradas",
        "Selfie en unas gradas de noche: una mujer con sombrero negro y, junto a ella, Iván con sombrero blanco y camisa blanca; detrás, mucha gente con sombrero",
        "En las gradas, de noche."
      ),
    ],
  },
  {
    slug: "colombia",
    title: "Colombia",
    order: 2,
    place: "Colombia",
    excerpt:
      "Las letras gigantes, la piedra con sus escalones, una calle techada de sombrillas y una catedral debajo de la tierra.",
    cover: photo(
      "colombia-sombrillas",
      "Iván caminando por una calle de piedra bajo sombrillas de colores, con camiseta blanca sin mangas y pantalón beige; a los lados, casas pintadas de colores",
      "La calle de las sombrillas."
    ),
    body: [
      "Colombia fue de los viajes grandes. Hay fotos con los brazos abiertos frente a las letras enormes, con la piedra y sus escalones detrás. Y otras más calladas: parado frente a unas columnas, con las manos en los bolsillos; caminando bajo las sombrillas de colores; de pie frente a un palacio de cuadros blancos y negros.",
      "También bajó a la catedral de sal. Está de espaldas, con una mano en el barandal, mirando la roca iluminada de colores. Esa foto nos gusta mucho: no está posando, está viendo.",
      "Él posaba sin pena, pero las fotos no son nada más de él. Son de los lugares. Quería que se vieran.",
    ],
    pullQuote: "Los brazos abiertos y el país entero atrás.",
    gallery: [
      photo(
        "colombia-letras",
        "Iván con los brazos abiertos frente a unas letras gigantes de Colombia en amarillo, azul y rojo; detrás, una piedra enorme con una escalera que sube en zigzag",
        "Frente a las letras, con la piedra detrás."
      ),
      photo(
        "colombia-palacio",
        "Iván de pie en una plaza, con camiseta negra sin mangas y pantalón gris, frente a un edificio de cuadros blancos y negros y un ciprés alto",
        "El palacio de cuadros."
      ),
      photo(
        "colombia-columnas",
        "Iván caminando con las manos en los bolsillos, camiseta blanca y pantalón caqui, frente a un edificio de columnas altas",
        "Las columnas."
      ),
      photo(
        "colombia-catedral",
        "Iván de espaldas, con gorra blanca, apoyado en un barandal rojo dentro de una cueva de sal iluminada con luces moradas, verdes y rojas",
        "Dentro de la catedral de sal."
      ),
    ],
  },
  {
    slug: "el-pueblo-de-colores",
    title: "El pueblo de colores",
    order: 3,
    place: "Guanajuato",
    excerpt:
      "La ciudad entera de fondo, de todos los colores, y él en primer plano con la camisa a juego.",
    cover: photo(
      "guanajuato-mirador",
      "Iván recargado en el barandal de un mirador, con gorra blanca, camisa amarilla de palmeras y pantalón beige; detrás, Guanajuato con sus casas de colores sobre los cerros",
      "Desde el mirador.",
      "center 45%"
    ),
    body: [
      "Dos fotos del mismo día. Una desde el mirador, con Guanajuato derramado por los cerros, casa sobre casa, cada una de un color. La otra abajo, recargado en una pared rosa, con una escalera de macetas subiendo a un lado.",
      "La camisa amarilla de palmeras es la misma en las dos. Le gustaba vestir así: que se notara que andaba de viaje.",
    ],
    gallery: [
      photo(
        "guanajuato-escalera",
        "Iván recargado en una pared rosa con las manos en los bolsillos; a su lado sube una escalera con macetas de flores y un perro negro asomado",
        "La pared rosa."
      ),
    ],
  },
  {
    slug: "junto-al-agua",
    title: "Junto al agua",
    order: 4,
    excerpt:
      "Un barco, palmeras, la arena y una laguna llena de flamencos. Las fotos de cuando andaba cerca del mar.",
    cover: photo(
      "agua-flamencos",
      "Iván con gorra negra y camiseta negra, de pie frente a una laguna entre manglares llena de flamencos rosas",
      "Los flamencos.",
      "center 40%"
    ),
    body: [
      "No todas son del mismo lugar, pero todas tienen agua cerca. Parado en la proa de un barco, agarrado al mástil, con la camisa de palmeras. Sentado en la playa con la gorra al revés, las palmeras atrás y el cielo nublado. Acostado en la arena, con la gorra azul tapándole los ojos.",
      "Y la de los flamencos, con decenas de ellos detrás, como si fueran parte del paisaje de siempre.",
      "El mar le quedaba bien.",
    ],
    gallery: [
      photo(
        "agua-barco",
        "Iván de pie en la proa de un barco, con lentes oscuros y camisa de palmeras, agarrado a un cable del mástil; detrás, el mar gris",
        "En el barco."
      ),
      photo(
        "agua-palmeras",
        "Iván sentado en la playa con gorra blanca al revés y lentes oscuros, mirando a un lado; detrás, palmeras y un cielo nublado",
        "La playa, con el cielo nublado."
      ),
      photo(
        "agua-arena",
        "Iván acostado en la arena sobre una toalla azul, con una gorra azul que le tapa los ojos",
        "En la arena."
      ),
    ],
  },
  {
    slug: "de-paseo",
    title: "De paseo",
    order: 5,
    excerpt:
      "Un arco de cempasúchil, un alebrije enorme con alas. Fotos de un día de fiesta en la plaza.",
    cover: photo(
      "paseo-cempasuchil",
      "Iván de pie bajo un arco de flores de cempasúchil, con gorra blanca, camisa de rayas, short blanco y tenis blancos; detrás, un monumento",
      "Bajo el arco de cempasúchil."
    ),
    body: [
      "Dos plazas en fiesta. En una, un arco de flores de cempasúchil, naranja hasta arriba, y él debajo con la camisa de rayas y los tenis blancos. En la otra, un alebrije gigante con alas anaranjadas y flores de papel a los pies.",
      "Son fotos de paseo: un lugar bonito, una pausa, una foto. Y seguir.",
    ],
    gallery: [
      photo(
        "paseo-alebrije",
        "Iván con gorra beige, lentes oscuros y camiseta azul, frente a un alebrije gigante en forma de perro con alas naranjas",
        "El alebrije."
      ),
    ],
  },
  {
    slug: "dias-de-aqui",
    title: "Días de aquí",
    order: 6,
    excerpt:
      "Las fotos que no son de viaje: una mesa, una plática, una tarde dibujando en el piso.",
    cover: photo(
      "casa-mesa",
      "Iván sentado a una mesa de madera, con camisa de rayas, tomando una bebida verde con popote; detrás, una pared de tabique",
      "En la mesa."
    ),
    body: [
      "Dos fotos en la misma mesa, una a color y otra en blanco y negro, con el vaso enfrente y la pared de tabique atrás. En una está tomando; en la otra se está riendo.",
      "El retrato de perfil, con la camisa blanca abierta y los lentes colgados, es de los que más nos gustan. No está posando. Está escuchando.",
      "La de la chamarra de vaca es de él sin más explicación. Y la última, en el piso, dibujando con una niña, es la que más dice de cómo era.",
    ],
    gallery: [
      photo(
        "casa-mesa-bn",
        "La misma mesa en blanco y negro: Iván sonriendo, con camisa de rayas, y un vaso con popote enfrente",
        "La misma mesa, sonriendo."
      ),
      photo(
        "casa-retrato",
        "Iván de perfil, con camisa blanca abierta y lentes oscuros colgados del cuello, frente a una pared de tabique",
        "De perfil, escuchando."
      ),
      photo(
        "casa-chamarra",
        "Iván con gorra negra, lentes oscuros y una chamarra con estampado de vaca sobre una camiseta blanca, frente a un edificio rosa bajo un cielo azul",
        "La chamarra de vaca."
      ),
      photo(
        "casa-dibujando",
        "Iván acostado en el piso, dibujando con lápices de colores junto a una niña de blusa rosa que colorea a su lado",
        "Dibujando en el piso."
      ),
    ],
  },
];

/** Entradas en el orden en que se muestran. */
export const orderedPosts = [...posts].sort((a, b) => a.order - b.order);

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Todas las fotos del sitio, para la página de galería. */
export const allPhotos: Array<Photo & { postSlug: string; postTitle: string }> =
  orderedPosts.flatMap((post) =>
    [post.cover, ...(post.gallery ?? [])].map((photo) => ({
      ...photo,
      postSlug: post.slug,
      postTitle: post.title,
    }))
  );
