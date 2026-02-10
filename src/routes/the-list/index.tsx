import useGetUniversityList from "@/hooks/use-get-university-list";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { chunk } from "remeda";
import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/the-list/")({
  component: RouteComponent,
});
const pageSize = 20;

function RouteComponent() {
  const { country } = Route.useSearch();
  const { data } = useGetUniversityList(country);

  const paginatedData = useMemo(() => {
    return data ? chunk(data, pageSize) : [];
  }, [data, pageSize]);

  const universitiesTotal = data?.length ?? 0;
  const pagesTotal = Math.max(1, Math.ceil(universitiesTotal / pageSize));

  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), pagesTotal));
  };
  const pageItems = useMemo(() => {
    if (pagesTotal <= 5) {
      return Array.from({ length: pagesTotal }, (_, i) => i + 1);
    }
    const items: Array<number | "ellipsis"> = [];
    const first = 1;
    const last = pagesTotal;
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(last - 1, currentPage + 1);

    items.push(first);
    if (left > 2) items.push("ellipsis");
    for (let p = left; p <= right; p++) items.push(p);
    if (right < last - 1) items.push("ellipsis");
    items.push(last);
    return items;
  }, [currentPage, pagesTotal]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), pagesTotal));
  }, [pagesTotal, country]);
  return (
    <Table>
      <TableCaption>
        {data && universitiesTotal > 0 && country
          ? `A list of ${universitiesTotal} universities in ${country}`
          : "Country not found"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Alpha two code</TableHead>
          <TableHead>State province</TableHead>
          <TableHead>Domains</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData[currentPage - 1]?.map((uni) => (
          <TableRow key={crypto.randomUUID()}>
            <TableCell className="font-semibold">{uni.name}</TableCell>
            <TableCell>{uni.country ?? "-"}</TableCell>
            <TableCell>{uni.alpha_two_code ?? "-"}</TableCell>
            <TableCell>{uni["state-province"] ?? "-"}</TableCell>
            <TableCell>
              {uni.web_pages.map((page, index) => (
                <Badge key={`${uni.name}-${page}-${index}`} variant="secondary">
                  <a href={page} target="_blank" rel="noopener noreferrer">
                    {uni.domains[index]}
                  </a>
                </Badge>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="text-sm">
                Page {currentPage} of {pagesTotal}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(currentPage - 1)}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-80"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {pageItems.map((item, index) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${item}`}>
                        <PaginationLink
                          isActive={item === currentPage}
                          onClick={() => goToPage(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(currentPage + 1)}
                      aria-disabled={currentPage === pagesTotal}
                      className={
                        currentPage === pagesTotal
                          ? "pointer-events-pointerup opacity-80"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
