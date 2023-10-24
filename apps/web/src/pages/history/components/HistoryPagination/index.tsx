import React, { FC, Dispatch, SetStateAction, useRef, useState, useEffect } from 'react';
import { cartTypes } from 'resources/cart';
import { Pagination } from '@mantine/core';

interface IHistoryPaginationProps {
  setParams: Dispatch<SetStateAction<cartTypes.IHistoryListParams>>;
  historyListResp?: cartTypes.HistoryListResponse;
}

const HistoryPagination: FC<IHistoryPaginationProps> = ({ setParams, historyListResp }) => {
  const isFirstPaginationRenderRef = useRef<boolean>(true);
  const [prevPageIndex, setPrevPageIndex] = useState<number>(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const onPageChangeHandler = (currentPage: any) => {
    if (!historyListResp) return;

    const lastItemId = historyListResp.items[historyListResp.items.length - 1].id;
    const firstItemId = historyListResp.items[0].id;

    const newParamsPartial = currentPage > pageIndex
      ? { startingAfter: lastItemId }
      : { endingBefore: firstItemId };

    setParams((prev) => ({
      ...prev,
      filter: newParamsPartial,
    }));

    setPageIndex(currentPage > pageIndex ? pageIndex + 1 : pageIndex - 1);
  };

  useEffect(
    () => {
      if (isFirstPaginationRenderRef.current) return;
      if (prevPageIndex === pageIndex) return;

      const newTotalPages = prevPageIndex < pageIndex
      && historyListResp?.hasMore
      && pageIndex + 1 > totalPages
        ? pageIndex + 1
        : totalPages;

      setTotalPages(newTotalPages);
      setPrevPageIndex(pageIndex);
    }, // eslint-disable-next-line
    [ historyListResp ]);

  useEffect(
    () => {
      if (!isFirstPaginationRenderRef.current) return;
      if (!historyListResp?.hasMore) return;
      setTotalPages(totalPages + 1);
      isFirstPaginationRenderRef.current = false;
    }, // eslint-disable-next-line
    [historyListResp]);

  return (
    totalPages > 1
      ? (
        <Pagination
          total={totalPages}
          value={pageIndex}
          onChange={onPageChangeHandler}
          color="black"
          siblings={1}
          disabled={pageIndex !== prevPageIndex}
        />
      )
      : null
  );
};

export default HistoryPagination;
