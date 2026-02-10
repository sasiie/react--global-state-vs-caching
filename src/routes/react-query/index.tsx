import DetailsPage from "@/components/details-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGetPokemon from "@/hooks/use-get-pokemon";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";


export const Route = createFileRoute("/react-query/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isPending, refetch } = useGetPokemon("squirtle");
  const isLoadingOrPending = isLoading || isPending;

  return (
    <>
      <p>
        1. Använd{" "}
        <a
          href="https://tanstack.com/query/latest/docs/framework/react/quick-start"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700"
        >
          TanStack/React Query
        </a>{" "}
        för att skapa en hook som hämtar och cachear data från ett API. Visa upp
        datan på denna sida. Kodexemplet nedan hämtar en pokémon från{" "}
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700"
        >
          PokéAPI
        </a>{" "}
        och visar upp bild och namn från API-responsen.
      </p>
      <p>
        2. Gör hooken återanvändbar så att du även kan använda den inne på{" "}
        <code className="bg-gray-200 text-gray-600 rounded-md px-1">
          details-page.tsx
        </code>
        . Följ aktiviteten i Network-fliken och säkerställ att en ny hämtning{" "}
        <i>inte</i> görs när hooken även körs inne på detaljsidan/modalen.
        Eftersom datan redan hämtats i denna komponent bör React Query kunna
        läsa från cachen därefter. Om det inte görs något nytt API-anrop när
        detaljsidan/modalen öppnas vet du att hooken fungerar som förväntat.{" "}
        <i>
          Du kan också experimentera med{" "}
          <span className="font-semibold">stale time</span> och sätta den till
          t.ex. 30000 millisekunder för att se när cachen rensas och ett nytt
          API-anrop görs.
        </i>
      </p>
      <p>
        3. <span className="font-semibold">Valfritt:</span> Tvinga fram en ny
        hämtning genom att passa{" "}
        <code className="bg-gray-200 text-gray-600 rounded-md px-1">
          refetch
        </code>{" "}
        som callback till knappen nedan. Ha Network-fliken öppen för att
        säkerställa att det fungerar som förväntat.
      </p>
      <DetailsPage species="squirtle">
        <Card className="relative min-h-36 cursor-pointer">
          {data && !isLoadingOrPending ? (
            <>
              <Badge
                variant="outline-indigo"
                className="absolute bottom-0 m-2 capitalize"
              >
                {data?.name}
              </Badge>
              <img src={data?.sprites?.front_default ?? ""} alt="pokemon" />
            </>
          ) : (
            <div className="size-24 px-4">
              <div className="flex items-center justify-center size-full bg-gray-100 text-wrap text-xs text-gray-500  px-4">
                {isLoadingOrPending ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  "Ingen pokemon hämtad"
                )}
              </div>
            </div>
          )}
        </Card>
      </DetailsPage>
      <Button
        variant="outline"
        onClick={() => {
          refetch();
        }}
      >
        Hämta pokemon på nytt
      </Button>
    </>
  );
}
