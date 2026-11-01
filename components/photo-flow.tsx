import { Photo } from "@/components/photo";
import { aspectOf, isLandscape, type Photo as PhotoData } from "@/content/photos";

/**
 * Las fotos de una historia, acomodadas según su forma.
 *
 * Una horizontal va sola, a todo el ancho. Dos verticales seguidas van lado a
 * lado, a la misma altura: cada una ocupa el ancho que le toca por su
 * proporción, así que ninguna se recorta. Si sobra una vertical, va sola y
 * centrada, con un alto máximo para que no se vuelva una tira.
 */
export function PhotoFlow({ photos }: { photos: PhotoData[] }) {
  const rows: PhotoData[][] = [];
  let pending: PhotoData | null = null;

  for (const photo of photos) {
    if (isLandscape(photo)) {
      if (pending) {
        rows.push([pending]);
        pending = null;
      }
      rows.push([photo]);
    } else if (pending) {
      rows.push([pending, photo]);
      pending = null;
    } else {
      pending = photo;
    }
  }
  if (pending) rows.push([pending]);

  return (
    <div className="space-y-10 sm:space-y-12">
      {rows.map((row, index) =>
        row.length === 1 ? (
          <Photo
            key={row[0]!.src}
            photo={row[0]!}
            maxHeight="80vh"
            sizes="(max-width: 768px) 100vw, 46rem"
            showCaption
          />
        ) : (
          <div
            key={`${row[0]!.src}-${index}`}
            className="flex items-start gap-4 sm:gap-6"
          >
            {row.map((photo) => (
              <div
                key={photo.src}
                className="min-w-0"
                style={{ flex: `${aspectOf(photo)} 1 0%` }}
              >
                <Photo
                  photo={photo}
                  sizes="(max-width: 768px) 50vw, 23rem"
                  showCaption
                />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
