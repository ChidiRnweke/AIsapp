package todo

case class ResourceType(name: String, owner: User, description: Option[String])

case class Resource(
    name: String,
    owner: User,
    types: List[ResourceType],
    description: Option[String]
)

case class TaskDetail(
    name: String,
    owner: User,
    timeSpent: NonNegInt = NonNegInt.zero,
    timeEstimateMin: Option[NonNegInt] = None,
    isFinished: Boolean = false,
    preferredFinishDate: Option[FutureDate] = None,
    description: Option[String] = None
)

enum Task(
    detail: TaskDetail,
    createdAt: FutureDate,
    modifiedAt: FutureDate = FutureDate.now
):

  case Todo(
      detail: TaskDetail,
      milestone: Milestone,
      minimumLength: NonNegInt,
      createdAt: FutureDate = FutureDate.now
  ) extends Task(detail, createdAt)

  case Milestone(
      detail: TaskDetail,
      aspect: Aspect,
      createdAt: FutureDate = FutureDate.now
  ) extends Task(detail, createdAt)

  case Aspect(detail: TaskDetail, createdAt: FutureDate = FutureDate.now)
      extends Task(detail, createdAt)
