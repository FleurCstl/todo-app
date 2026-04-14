/**
 * SidebarHeader component displays the application brand and subtitle.
 */
export function SidebarHeader() {
  return (
    <div className="p-6 pb-4">
      <h2 className="text-xl font-extrabold text-primary tracking-tight">TaskMaster</h2>
      <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Your personal workspace</p>
    </div>
  );
}
