import React, { FC } from 'react';
import { Button, Container, Group, Stack } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useStyles } from './styles';
import FilterNumberInput from '../FilterNumberInput';

interface IFilterProps {
  filterByPriceFrom?: number;
  filterByPriceTo?: number;
  setPriceFrom: (val: (number | '')) => void;
  setPriceTo: (val: (number | '')) => void;
}

const Filter: FC<IFilterProps> = ({
  filterByPriceFrom,
  setPriceFrom,
  setPriceTo,
  filterByPriceTo,
}) => {
  const { classes } = useStyles();

  return (
    <Stack className={classes.componentRoot}>
      <Group className={classes.header}>
        <Container className={classes.componentNameSection}>
          Filters
        </Container>
        <Button
          variant="subtle"
          color="gray"
          compact
          className={classes.resetAllBtn}
          type="reset"
          rightIcon={(<IconX className={classes.resetAllBtnCross} />)}
          onClick={() => {
            setPriceFrom('');
            setPriceTo('');
          }}
        >
          Reset All
        </Button>
      </Group>
      <Stack spacing=".5em" className={classes.filterType}>
        <Container className={classes.filterTypeName}>
          Price
        </Container>
        <Group grow className={classes.filterInputSection}>
          <FilterNumberInput
            state={filterByPriceFrom}
            setState={setPriceFrom}
            minVal={0}
            maxVal={filterByPriceTo ?? Infinity}
            icon={<Container className={classes.filterInputIcon}>From:</Container>}
            iconWidth={54}
            className={classes.filterInput}
          />
          <FilterNumberInput
            state={filterByPriceTo}
            setState={setPriceTo}
            minVal={filterByPriceFrom ?? 0}
            icon={<Container className={classes.filterInputIcon}>To:</Container>}
            iconWidth={37}
            className={classes.filterInput}
          />
        </Group>
      </Stack>
    </Stack>
  );
};

export default Filter;
