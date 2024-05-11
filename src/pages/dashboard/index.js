import { Grid, Typography } from '@mui/material';
import Card from 'components/Cards';
import MainCard from 'components/MainCard/index';
import TaskTable from '../../components/TaskTable';
import { useSelector } from 'react-redux';

const groupBy = (arr) => {
  let res = {
    completed: [],
    inprogress: [],
    todo: [],
    cancelled: []
  };
  arr.forEach((val) => {
    res[val.status] = [...res[val.status], val];
  });

  return res;
};

const DashboardDefault = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const groupedTasks = groupBy(tasks);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card title="Todo tasks" count={groupedTasks.todo.length} variant="inprogress" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card title="In-Progress tasks" count={groupedTasks.inprogress.length} variant="todo" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card title="Completed tasks" count={groupedTasks.completed.length} variant="completed" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card title="Cancelled tasks" count={groupedTasks.cancelled.length} variant="error" />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">In-Progress tasks</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <TaskTable isPendingPage={true} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
