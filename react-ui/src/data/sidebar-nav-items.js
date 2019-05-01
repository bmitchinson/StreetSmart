export default function() {
  return [
    {
      title: "Dashboard",
      to: "/blog-overview",
      htmlBefore: '<i class="material-icons">pie_chart</i>',
      htmlAfter: ""
    },
    {
      title: "Table",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/table",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    }
  ];
}
