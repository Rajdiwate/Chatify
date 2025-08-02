import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useConversation } from "../../lib/hooks/useConversation";
import { useSendGroupInviteMutation } from "../../lib/rtk/groupApi";
import { toast } from "react-toastify";

// Zod schema for form validation
const addMembersSchema = z.object({
  selectedFriends: z
    .array(z.string())
    .min(1, "Please select at least one friend"),
});

type AddMembersFormData = z.infer<typeof addMembersSchema>;

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  conversationId: string;
}

const AddMembersModal = ({
  open,
  onClose,
  conversationId,
}: AddMembersModalProps) => {
  const { directConversations, currentGroupConversation } = useConversation();
  const sendInvite = useSendGroupInviteMutation()[0];
  const { isLoading } = useSendGroupInviteMutation()[1];

  const notJoinedMembers = directConversations.filter((conversation) => {
    const friendId = conversation.friend.id;
    const isAlreadyMember = currentGroupConversation?.members.some(
      (member) => member.user.id === friendId
    );

    return !isAlreadyMember;
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMembersFormData>({
    resolver: zodResolver(addMembersSchema),
    defaultValues: {
      selectedFriends: [],
    },
  });

  // Filter conversations that have a friend property
  const friendConversations =
    notJoinedMembers?.filter((conversation) => conversation.friend) || [];

  const onSubmit = async (data: AddMembersFormData) => {
    await sendInvite({
      conversationId,
      receiverIds: data.selectedFriends,
    }).then(({ data }) => {
      if (data?.success) {
        toast("Invite sent successfully", { type: "success" });
      }
    });

    console.log("Selected friend IDs:", data.selectedFriends);
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxHeight: "80vh",
    bgcolor: "background.paper",
    borderRadius: 10,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="add-members-modal-title"
      aria-describedby="add-members-modal-description"
    >
      <Paper sx={modalStyle}>
        <Typography
          id="add-members-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Add Members
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select friends to add to the conversation:
          </Typography>

          <Controller
            name="selectedFriends"
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  mb: 1,
                }}
              >
                <FormGroup>
                  {friendConversations.map((conversation) => (
                    <FormControlLabel
                      key={conversation.friend.id || conversation.id}
                      sx={{
                        justifyContent: "space-between",
                        marginLeft: 0,
                        marginRight: 0,
                        "& .MuiFormControlLabel-label": {
                          flexGrow: 1,
                        },
                      }}
                      labelPlacement="start"
                      control={
                        <Checkbox
                          checked={field.value.includes(
                            conversation.friend.id || conversation.id
                          )}
                          onChange={(e) => {
                            const friendId =
                              conversation.friend.id || conversation.id;
                            if (e.target.checked) {
                              field.onChange([...field.value, friendId]);
                            } else {
                              field.onChange(
                                field.value.filter((id) => id !== friendId)
                              );
                            }
                          }}
                        />
                      }
                      label={conversation.friend.username}
                    />
                  ))}
                </FormGroup>
              </Box>
            )}
          />

          {errors.selectedFriends && (
            <Typography
              color="error"
              variant="caption"
              display="block"
              sx={{ mt: 1 }}
            >
              {errors.selectedFriends.message}
            </Typography>
          )}

          {friendConversations.length === 0 && (
            <Typography color="text.secondary" variant="body2" sx={{ my: 2 }}>
              No friends available to add.
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3 }}
            justifyContent="flex-end"
          >
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={friendConversations.length === 0}
              loading={isLoading}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddMembersModal;
