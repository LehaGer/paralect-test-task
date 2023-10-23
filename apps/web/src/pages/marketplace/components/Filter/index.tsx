import React, { FC } from 'react';
import { Button, Container, Group, NumberInput, Stack } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useStyles } from './styles';

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
      <Group>
        <Container className={classes.componentNameSection}>
          Filters
        </Container>
        <Button
          variant="subtle"
          color="gray"
          radius="xl"
          size="xs"
          compact
          className={classes.resetAllBtn}
          type="reset"
          rightIcon={<IconX size={15} spacing={0} style={{ margin: 0 }} />}
          onClick={() => {
            setPriceFrom('');
            setPriceTo('');
          }}
        >
          reset all
        </Button>
      </Group>
      <Stack spacing=".5em">
        <Container className={classes.filterTypeName}>
          Price
        </Container>
        <Group grow>
          <NumberInput
            value={filterByPriceFrom ?? ''}
            onChange={setPriceFrom}
            icon={<Container>From</Container>}
            iconWidth={60}
            min={0}
            max={filterByPriceTo ?? Infinity}
          />
          <NumberInput
            value={filterByPriceTo ?? ''}
            onChange={setPriceTo}
            icon={<Container>To</Container>}
            iconWidth={35}
            className={classes.priceInput}
            min={filterByPriceFrom ?? 0}
          />
        </Group>
      </Stack>
    </Stack>
  );
};

export default Filter;
