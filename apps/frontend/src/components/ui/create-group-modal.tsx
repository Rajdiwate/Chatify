import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import z from "zod";
import { CustomInput } from "./custom-input";
import { CustomButton } from "./custom-button";
import { useCreateGroupMutation } from "../../lib/rtk/groupApi";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

const createGroupSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(5).max(100).optional(),
});

export type TCreateGroup = z.infer<typeof createGroupSchema>;

const CreateGroupModal = ({ open, onClose }: CreateGroupModalProps) => {
  const [createGroup] = useCreateGroupMutation();
  const {
    clearErrors,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TCreateGroup>({
    resolver: zodResolver(createGroupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: TCreateGroup) => {
    clearErrors();
    console.log(data);
    await createGroup(data).then((data) => {
      if (data.data && data.data.success) {
        onClose();
      }
    });
  };

  const handleClose = () => {
    setValue("name", "");
    setValue("description", "");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          borderRadius: 10,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create New Group
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <CustomInput
            {...register("name")}
            label="Username"
            type="text"
            required
            error={!!errors?.name}
            helperText={errors.name?.message}
            placeholder="Enter Group Name"
          />

          <CustomInput
            {...register("description")}
            label="Description"
            type="text"
            error={!!errors?.description}
            helperText={errors.description?.message}
            placeholder="Enter description"
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <CustomButton
              type="submit"
              loading={isSubmitting}
              className="mt-6"
              disabled={isSubmitting}
            >
              Create Account
            </CustomButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateGroupModal;
