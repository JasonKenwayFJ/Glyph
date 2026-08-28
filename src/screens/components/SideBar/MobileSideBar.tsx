import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
    IconFileDescriptionFilled,
    IconCardsFilled,
    IconArrowAutofitWidthFilled,
    IconGridDots,
    IconArticleFilled,
    IconMessageChatbotFilled,
    IconListDetailsFilled,
    IconHeartFilled,
    IconPictureInPictureFilled,
    IconPhotoFilled,
    IconTrashFilled,
} from "@tabler/icons-react"
import "./../../MainStyles/Panels/SideBarStyles/MobileSideBarStyle.scss"

// Три пункта, которые всегда на виду
const dockItems = [
    { icon: IconFileDescriptionFilled, label: "Документы", path: "/entityPage/Documents" },
    { icon: IconCardsFilled, label: "Карточки", path: "/entityPage/Card" },
    { icon: IconArrowAutofitWidthFilled, label: "Связи", path: "/entityPage/Graph" },
]

// Всё остальное — сгруппировано так же, как на десктопе (Navigation/Explorer/Links),
// живёт в шторке, а не на постоянном доке
const sheetSections = [
    {
        title: "Navigation",
        items: [
            { icon: IconMessageChatbotFilled, label: "Ассистент", path: "/assistant" },
            { icon: IconArticleFilled, label: "Редактор", path: "/mainPage" },
        ],
    },
    {
        title: "Explorer",
        items: [
            { icon: IconListDetailsFilled, label: "Задачи", path: "/entityPage/Task" },
            { icon: IconHeartFilled, label: "Избранное", path: "/entityPage/Cards" },
            { icon: IconPictureInPictureFilled, label: "Медиа", path: "/entityPage/Cards" },
            { icon: IconPhotoFilled, label: "Аудио", path: "/entityPage/Audio" },
        ],
    },
    {
        title: "Links",
        items: [
            { icon: IconTrashFilled, label: "Мусор", path: "/entityPage/Trash" },
        ],
    },
]

export const MobileSideBar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isSheetOpen, setSheetOpen] = useState(false)

    const activeDockIndex = dockItems.findIndex(item => location.pathname.startsWith(item.path))

    const goTo = (path: string) => {
        navigate(path)
        setSheetOpen(false) // переход из шторки сразу её закрывает
    }

    return (
        <div className="MobileSideBarContainer">

            {/* Затемнение фона — кликом по нему тоже закрывает шторку */}
            <div
                className={`SheetOverlay ${isSheetOpen ? "is-open" : ""}`}
                onClick={() => setSheetOpen(false)}
            />

            {/* Шторка со всеми остальными разделами по категориям */}
            <div className={`Sheet ${isSheetOpen ? "is-open" : ""}`}>
                <div className="SheetHandle" />

                {sheetSections.map(section => (
                    <div className="SheetSection" key={section.title}>
                        <p className="SheetSectionTitle">{section.title}</p>
                        <div className="SheetGrid">
                            {section.items.map(item => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.path}
                                        className="GridTile"
                                        onClick={() => goTo(item.path)}
                                    >
                                        <div>
                                            <Icon stroke={2} size={30}/>
                                            <span>{item.label}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Постоянный док */}
            <nav className="Dock">
                <div
                    className="DockIndicator"
                    style={{
                        transform: `translateX(${Math.max(activeDockIndex, 0) * 52}px)`,
                        opacity: activeDockIndex >= 0 ? 1 : 0,
                    }}
                />

                {dockItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = index === activeDockIndex
                    return (
                        <button
                            key={item.path}
                            className={`DockItem ${isActive ? "active" : ""}`}
                            aria-label={item.label}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon stroke={2} size={22} />
                        </button>
                    )
                })}

                <button
                    className={`DockItem ${isSheetOpen ? "active" : ""}`}
                    aria-label="Ещё разделы"
                    onClick={() => setSheetOpen(prev => !prev)}
                >
                    <IconGridDots stroke={2} size={22} />
                </button>
            </nav>
        </div>
    )
}