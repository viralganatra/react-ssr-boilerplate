import Loadable from 'react-loadable';
import LoadingPage from 'universal/pages/loading-page';

export default Loadable({
  loader: () => import('./not-found-page'),
  loading: LoadingPage,
});
