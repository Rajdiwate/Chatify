export type dbFriend = {
  id: string;
  username: string;
  email: string;
};

export type friends = dbFriend[];

export type TFriendState = {
  loading: boolean;
  error?: string;
  friends?: friends;
  fetched : boolean
};

export type TGetFriendsResponse = {
    success : true,
    friends : friends
}

export type TAcceptRequestResponse = TGetFriendsResponse

export type TSendRequestResponse = {
  success : true , 
  friendRequest : unknown

}