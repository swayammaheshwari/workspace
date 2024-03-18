export async function get_data_from_url(url) {
  let users_url =  "https://api.github.com/users";
  if(url === undefined){ url = users_url }
  const data = await fetch(url);
  return await data.json();
}