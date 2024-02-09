let users = [];

(function () {
  let user = document.getElementById("ok").value;
  users.push(user);
  console.log(users);
})();

console.log(users);
export { users };
