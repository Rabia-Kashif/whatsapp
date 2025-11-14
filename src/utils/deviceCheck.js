export const isMobileDevice = () => {
    return (
        window.innerWidth < 900 ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

    )
}