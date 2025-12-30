const normalizeStatus = (status) => (status || "").toLowerCase();

export const ACTIVE_STATUSES = ["active", "open"];

export const isActiveStatus = (status) =>
  ACTIVE_STATUSES.includes(normalizeStatus(status));

export const buildActiveStatusFilter = () => ({
  status: {
    $in: ACTIVE_STATUSES.map(
      (value) => new RegExp(`^${value}$`, "i")
    ),
  },
});
