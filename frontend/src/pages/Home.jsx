import { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Home = () => {
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [LayoutComponent, setLayoutComponent] = useState(null);

  const layouts = useMemo(() => [
    () => import('../layouts/Layout1'),
    () => import('../layouts/Layout2')
  ], []);

  useEffect(() => {
    const loadLayout = async () => {
      const { default: Component } = await layouts[layoutIndex]();
      setLayoutComponent(() => Component);
    };

    loadLayout();
  }, [layoutIndex, layouts]);

  useEffect(() => {
    socket.on('change_layout', (data) => {
      setLayoutIndex(data.layoutIndex);
    });

    return () => {
      socket.off('change_layout');
    };
  }, []);

  return (
    <>
      {LayoutComponent && <LayoutComponent />}
    </>
  );
};

export default Home;
