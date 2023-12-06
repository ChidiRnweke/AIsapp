package todo

case class ResourceType(name: String, owner: User, description: Option[String])

case class Resource(
    name: String,
    owner: User,
    types: List[ResourceType],
    description: Option[String]
)
case class Todo(
    name: String,
    timeEstimateMin: PosInt,
    preferredFinishDate: FutureDate,
    timeSpent: PosInt,
    owner: User,
    description: Option[String],
    createdAt: FutureDate = FutureDate.now,
    isFinished: Boolean = false
):
  val modifiedAt = FutureDate.now
