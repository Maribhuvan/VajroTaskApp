import { Grid, Typography, Button } from '@mui/material';
import TaskTable from '../../components/TaskTable';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
const Tasks = () => {
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate('/add');
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Grid item>
            <Typography variant="h5">Tasks</Typography>
          </Grid>
          <Grid item>
            <Button
              startIcon={
                <PlusOutlined
                  style={{
                    fontSize: '0.9em'
                  }}
                />
              }
              variant="outlined"
              color="primary"
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <TaskTable />
      </Grid>
    </Grid>
  );
};

export default Tasks;
