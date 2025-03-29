import Array "mo:base/Array";
import Principal "mo:base/Principal";

actor {

  stable var users : [Principal] = [];

  public shared({ caller }) func registerUser() : async Principal {
    users := Array.append(users, [caller]);
    return caller;
  };

  public query func getUsers() : async [Principal] {
    return users;
  };
}
