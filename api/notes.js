let { data, error } = await supabase
  .from("notes")
  .select("*")
  .order("last_edited", { ascending: false });

console.log(data);