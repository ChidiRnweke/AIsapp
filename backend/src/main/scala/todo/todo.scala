package todo

case class ResourceType(name: String, owner: User, description: Option[String])

case class Resource(
    name: String,
    owner: User,
    types: List[ResourceType],
    description: Option[String]
)

case class TaskDetails(
    name: String,
    timeEstimateMin: NonNegInt,
    preferredFinishDate: FutureDate,
    timeSpent: NonNegInt,
    owner: User,
    isFinished: Boolean = false,
    description: Option[String]
)

enum Task(
    details: TaskDetails,
    createdAt: FutureDate,
    modifiedAt: FutureDate = FutureDate.now
):

  case Todo(
      details: TaskDetails,
      milestone: Milestone,
      minimumLength: NonNegInt,
      createdAt: FutureDate = FutureDate.now
  ) extends Task(details, createdAt)

  case Milestone(
      details: TaskDetails,
      aspect: Aspect,
      createdAt: FutureDate = FutureDate.now
  ) extends Task(details, createdAt)

  case Aspect(details: TaskDetails, createdAt: FutureDate = FutureDate.now)
      extends Task(details, createdAt)
