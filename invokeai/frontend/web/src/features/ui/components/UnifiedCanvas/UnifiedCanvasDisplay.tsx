import { Box, Flex } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
// import IAICanvas from 'features/canvas/components/IAICanvas';
import { useAppDispatch, useAppSelector } from 'app/storeHooks';
import IAICanvas from 'features/canvas/components/IAICanvas';
import IAICanvasResizer from 'features/canvas/components/IAICanvasResizer';
import IAICanvasToolbar from 'features/canvas/components/IAICanvasToolbar/IAICanvasToolbar';
import { canvasSelector } from 'features/canvas/store/canvasSelectors';
import { setDoesCanvasNeedScaling } from 'features/canvas/store/canvasSlice';
import { debounce, isEqual } from 'lodash';

import { useLayoutEffect } from 'react';

const selector = createSelector(
  [canvasSelector],
  (canvas) => {
    const { doesCanvasNeedScaling } = canvas;
    return {
      doesCanvasNeedScaling,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: isEqual,
    },
  }
);

const UnifiedCanvasDisplay = () => {
  const dispatch = useAppDispatch();

  const { doesCanvasNeedScaling } = useAppSelector(selector);

  useLayoutEffect(() => {
    dispatch(setDoesCanvasNeedScaling(true));

    const resizeCallback = debounce(() => {
      dispatch(setDoesCanvasNeedScaling(true));
    }, 250);

    window.addEventListener('resize', resizeCallback);

    return () => window.removeEventListener('resize', resizeCallback);
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        padding: 4,
        borderRadius: 'base',
        bg: 'base.850',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          width: '100%',
          height: '100%',
        }}
      >
        <IAICanvasToolbar />
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            width: '100%',
            height: '100%',
          }}
        >
          {doesCanvasNeedScaling ? <IAICanvasResizer /> : <IAICanvas />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default UnifiedCanvasDisplay;
