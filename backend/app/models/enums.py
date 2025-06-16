from enum import Enum

class MainFieldEnum(str, Enum):
    software_development = "Software Development"
    infrastructure_system = "Infrastructure & System"
    ai_ml = "AI/ML"
    data_science = "Data Science"
    cybersecurity = "Cybersecurity"
    ui_ux = "UI/UX"


class CompanySizeEnum(str, Enum):
    me = "Me"
    micro = "Micro"
    small = "Small"
    medium = "Medium"
    large = "Large"


class WorkSettingEnum(str, Enum):
    hybrid = "hybrid"
    remote = "remote"
    onsite = "onsite"


class WorkTypeEnum(str, Enum):
    part_time = "part-time"
    fulltime = "fulltime"
    contractual = "contractual"
    internship = "internship"


class InterviewTypeEnum(str, Enum):
    onsite = "onsite"
    phone_call = "phone_call"
    online = "online"


class InterviewStatusEnum(str, Enum):
    cancelled = "cancelled"
    confirmed = "confirmed"

