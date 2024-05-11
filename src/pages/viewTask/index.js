import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Stack, InputLabel, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStatus, getPriority } from 'components/TaskTable';
import MainCard from 'components/MainCard';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomDialog from 'components/Dialog';
import AlertSnackBar from 'components/SnackBar';
import { deleteTask } from 'store/reducers/tasks';

const ViewTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location?.state?.taskId;

  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const taskInformation = tasks.find((o) => o.taskId === taskId);

  const [snackBar, setSnackBar] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    description: 'Are you sure want to delete this record. Once deleted we cannot retrive back',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    customValue: ''
  });

  const handleEditTask = () => {
    navigate('/edit', { state: { taskId: taskId } });
  };

  const handleSnackbar = () => {
    setSnackBar((prev) => !prev);
  };

  const handleCancel = () => {
    setDialog((prev) => {
      return {
        ...prev,
        open: false,
        title: '',
        customValue: ''
      };
    });
  };

  const handleConfirm = (id) => {
    dispatch(deleteTask({ taskId: id }));
    handleCancel();
    navigate(-1);
  };

  const handleDeleteTask = (taskId) => {
    setDialog((prev) => {
      return { ...prev, open: true, title: `Delete task - ${taskId}?`, customValue: taskId };
    });
  };

  return (
    <>
      <Grid container rowSpacing={8} columnSpacing={5}>
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
              <Typography variant="h5">View Task</Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{ mr: 2.25 }}
                variant="outlined"
                startIcon={
                  <EditOutlined
                    style={{
                      fontSize: '0.9em'
                    }}
                  />
                }
                color="primary"
                onClick={handleEditTask}
              >
                Edit Task
              </Button>
              <Button
                variant="outlined"
                startIcon={
                  <DeleteOutlined
                    style={{
                      fontSize: '0.9em'
                    }}
                  />
                }
                color="error"
                onClick={() => handleDeleteTask(taskInformation?.taskId)}
              >
                Delete Task
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} sm={12} lg={12}>
                <Typography variant="h4">
                  #{taskInformation?.taskId} - {taskInformation?.title}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} sm={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="task-title">Status</InputLabel>
                  {getStatus(taskInformation?.status)}
                </Stack>
              </Grid>
              <Grid item xs={6} md={3} sm={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="task-title">Priority</InputLabel>
                  {getPriority(taskInformation?.priority)}
                </Stack>
              </Grid>
              <Grid item xs={6} md={3} sm={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="task-title">Start Date</InputLabel>
                  <Typography variant="h5">{taskInformation?.startDate}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} md={3} sm={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="task-title">Due Date</InputLabel>
                  <Typography variant="h5">{taskInformation?.endDate}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={12} sm={12} lg={12}>
                <Stack spacing={2}>
                  <InputLabel htmlFor="task-title">Description</InputLabel>
                  <Grid item xs={12} md={12} sm={12} lg={12} />
                  <CKEditor editor={ClassicEditor} data={taskInformation?.description ?? ''} />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
      <CustomDialog
        open={dialog.open}
        handleClose={handleCancel}
        title={dialog.title}
        description={dialog.description}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        handleConfirm={handleConfirm}
        confirmVariant={'error'}
        customValue={dialog.customValue}
      />
      <AlertSnackBar open={snackBar} onClose={handleSnackbar} severity="success" message={`Task deleted sucessfully!`} />
    </>
  );
};

export default ViewTask;
