import { HelmetProvider } from 'react-helmet-async'
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import FloatingButtons from './components/FloatingButtons'
import Footer from './components/Footer'
import Header from './components/Header'
import Loader from './components/Loader'
import Login from './components/Login'
import Register from './components/Register'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AdminArticlesPage from './pages/AdminArticlesPage'
import AdminCoursesPage from './pages/AdminCoursesPage'
import AdminLessonsPage from './pages/AdminLessonsPage'
import AdminModulesPage from './pages/AdminModulesPage'
import AdminSectionsPage from './pages/AdminSectionsPage'
import ArticleFormPage from './pages/ArticleFormPage'
import ArticleViewPage from './pages/ArticleViewPage'
import ArticlesPage from './pages/ArticlesPage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryFormPage from './pages/CategoryFormPage'
import CheckoutCancelPage from './pages/CheckoutCancelPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'
import CommunityLandingPage from './pages/CommunityLandingPage'
import CompaniesPage from './pages/CompaniesPage'
import CompanyFormPage from './pages/CompanyFormPage'
import ContactPage from './pages/ContactPage'
import CouponFormPage from './pages/CouponFormPage'
import CouponsPage from './pages/CouponsPage'
import CourseFormPage from './pages/CourseFormPage'
import CourseViewPage from './pages/CourseViewPage'
import CourseViewPageVimeo from './pages/CourseViewPageVimeo'
import CoursesPage from './pages/CoursesPage'
import FAQQuestionPage from './pages/FAQQuestionPage'
import HomePage from './pages/HomePage'
import LessonFormPage from './pages/LessonFormPage'
import ModuleFormPage from './pages/ModuleFormPage'
import ModulesPage from './pages/ModulesPage'
import MyCoursesPage from './pages/MyCoursesPage'
import MySubscriptionsPage from './pages/MySubscriptionsPage'
import PaymentSettingsPage from './pages/PaymentSettingsPage'
import ProductCheckoutPage from './pages/ProductCheckoutPage'
import ProductFormPage from './pages/ProductFormPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'
import PublicCheckoutCancelPage from './pages/PublicCheckoutCancelPage'
import PublicCheckoutPage from './pages/PublicCheckoutPage'
import PublicCheckoutSuccessPage from './pages/PublicCheckoutSuccessPage'
import QrCodeGeneratorPage from './pages/QrCodeGeneratorPage'
import SectionFormPage from './pages/SectionFormPage'
import SupportPage from './pages/SupportPage'
import UserFormPage from './pages/UserFormPage'
import UsersPage from './pages/UsersPage'
import ActiveSubscriptionsPage from './pages/admin/ActiveSubscriptionsPage'
import AdminAffiliateBillingPage from './pages/admin/AdminAffiliateBillingPage'
import AdminAffiliateDetailsPage from './pages/admin/AdminAffiliateDetailsPage'
import AdminAffiliatesPage from './pages/admin/AdminAffiliatesPage'
import AdminManageAffiliatesPage from './pages/admin/AdminManageAffiliatesPage'
import AdminWithdrawalsPage from './pages/admin/AdminWithdrawalsPage'
import FAQCategoriesPage from './pages/admin/FAQCategoriesPage'
import FAQCategoryFormPage from './pages/admin/FAQCategoryFormPage'
import FAQFormPage from './pages/admin/FAQFormPage'
import FAQQuestionFormPage from './pages/admin/FAQQuestionFormPage'
import FAQQuestionsPage from './pages/admin/FAQQuestionsPage'
import FAQsPage from './pages/admin/FAQsPage'
import PurchaseHistoryPage from './pages/admin/PurchaseHistoryPage'
import SEOFormPage from './pages/admin/SEOFormPage'
import SEOManagementPage from './pages/admin/SEOManagementPage'
import SalesDashboardPage from './pages/admin/SalesDashboardPage'
import SalesReportPage from './pages/admin/SalesReportPage'
import AffiliateFinancialPage from './pages/affiliate/AffiliateFinancialPage'
import AffiliatePaymentSettingsPage from './pages/affiliate/AffiliatePaymentSettingsPage'
import AffiliateProductsPage from './pages/affiliate/AffiliateProductsPage'
import MyAffiliationsPage from './pages/affiliate/MyAffiliationsPage'

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader />
                    <p className="theme-text-secondary">Carregando...</p>
                </div>
            </div>
        )
    }

    return user ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />
}

// Componente placeholder para páginas admin (temporário)
const AdminPlaceholder = ({ title }: { title: string }) => (
    <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <h1 className="text-4xl font-bold theme-text-primary mb-4">{title}</h1>
                <p className="theme-text-secondary">Esta página está em desenvolvimento.</p>
            </div>
        </div>
        <Footer />
    </div>
)

// Componente wrapper para redirecionamento inteligente do Login
const LoginRedirect = () => {
    const { user, profile } = useAuth()
    const location = useLocation()

    let destination = '/admin/dashboard'
    if (profile) {
        if (['admin', 'super_admin', 'company_admin'].includes(profile.role)) {
            destination = '/admin/vendas/dashboard'
        } else if (['user', 'company_user'].includes(profile.role)) {
            destination = '/meus-cursos'
        }
    }

    const from = location.state?.from?.pathname || destination

    return user ? <Navigate to={from} replace /> : <Login />
}

// Componente wrapper para redirecionamento inteligente do Register
const RegisterRedirect = () => {
    const { user, profile } = useAuth()

    let destination = '/admin/dashboard'
    if (profile) {
        if (['admin', 'super_admin', 'company_admin'].includes(profile.role)) {
            destination = '/admin/vendas/dashboard'
        } else if (['user', 'company_user'].includes(profile.role)) {
            destination = '/meus-cursos'
        }
    }

    return user ? <Navigate to={destination} replace /> : <Register />
}

import { AuthenticatedLayout } from './layouts'

function AppRoutes() {
    return (
        <AuthenticatedLayout>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginRedirect />}
                />
                <Route
                    path="/register"
                    element={<RegisterRedirect />}
                />
                <Route
                    path="/cursos"
                    element={<CoursesPage />}
                />
                <Route
                    path="/curso/:courseId/modulos"
                    element={
                        <ProtectedRoute>
                            <ModulesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/curso/:courseId/modulos/:moduleId"
                    element={
                        <ProtectedRoute>
                            <CourseViewPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/curso/:courseId/modulos/:moduleId/vimeo"
                    element={
                        <ProtectedRoute>
                            <CourseViewPageVimeo />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/articles"
                    element={<ArticlesPage />}
                />
                <Route
                    path="/article/:slug"
                    element={<ArticleViewPage />}
                />
                <Route
                    path="/contato"
                    element={<ContactPage />}
                />
                <Route
                    path="/suporte"
                    element={<SupportPage />}
                />
                <Route
                    path="/:faqSlug/:categorySlug/:questionSlug"
                    element={<FAQQuestionPage />}
                />
                <Route
                    path="/meus-cursos"
                    element={
                        <ProtectedRoute>
                            <MyCoursesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/minhas-assinaturas"
                    element={
                        <ProtectedRoute>
                            <MySubscriptionsPage />
                        </ProtectedRoute>
                    }
                />
                {/* Rotas Admin */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminPlaceholder title="Dashboard Administrativo" />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/categorias"
                    element={
                        <AdminRoute>
                            <CategoriesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/categorias/nova"
                    element={
                        <AdminRoute>
                            <CategoryFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/categorias/:id"
                    element={
                        <AdminRoute>
                            <CategoryFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cursos"
                    element={
                        <AdminRoute>
                            <AdminCoursesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cursos/:id/modulos"
                    element={
                        <AdminRoute>
                            <AdminModulesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cursos/novo"
                    element={
                        <AdminRoute>
                            <CourseFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cursos/:id"
                    element={
                        <AdminRoute>
                            <CourseFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/modulos"
                    element={
                        <AdminRoute>
                            <AdminModulesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/modulos/novo"
                    element={
                        <AdminRoute>
                            <ModuleFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/modulos/:id"
                    element={
                        <AdminRoute>
                            <ModuleFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/secoes"
                    element={
                        <AdminRoute>
                            <AdminSectionsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/secoes/nova"
                    element={
                        <AdminRoute>
                            <SectionFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/secoes/:id"
                    element={
                        <AdminRoute>
                            <SectionFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/aulas"
                    element={
                        <AdminRoute>
                            <AdminLessonsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/aulas/novo"
                    element={
                        <AdminRoute>
                            <LessonFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/aulas/:id"
                    element={
                        <AdminRoute>
                            <LessonFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/usuarios"
                    element={
                        <AdminRoute>
                            <UsersPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/usuarios/novo"
                    element={
                        <AdminRoute>
                            <UserFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/usuarios/:id"
                    element={
                        <AdminRoute>
                            <UserFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/paginas"
                    element={
                        <AdminRoute>
                            <AdminArticlesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/paginas/novo"
                    element={
                        <AdminRoute>
                            <ArticleFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/paginas/:id"
                    element={
                        <AdminRoute>
                            <ArticleFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/produtos"
                    element={
                        <AdminRoute>
                            <ProductsPage />
                        </AdminRoute>
                    }
                />
                < Route
                    path="/admin/produtos/novo"
                    element={
                        < AdminRoute >
                            <ProductFormPage />
                        </AdminRoute >
                    }
                />
                < Route
                    path="/admin/produtos/:id/editar"
                    element={
                        < AdminRoute >
                            <ProductFormPage />
                        </AdminRoute >
                    }
                />
                < Route
                    path="/admin/comentarios"
                    element={
                        < AdminRoute >
                            <AdminPlaceholder title="Moderar Comentários" />
                        </AdminRoute >
                    }
                />
                < Route
                    path="/admin/relatorios"
                    element={
                        < AdminRoute >
                            <AdminPlaceholder title="Relatórios" />
                        </AdminRoute >
                    }
                />
                < Route
                    path="/admin/empresas"
                    element={
                        < AdminRoute >
                            <CompaniesPage />
                        </AdminRoute >
                    }
                />
                < Route
                    path="/admin/empresas/nova"
                    element={
                        < AdminRoute >
                            <CompanyFormPage />
                        </AdminRoute >
                    }
                />
                < Route
                    path="/admin/empresas/:id"
                    element={
                        < AdminRoute >
                            <CompanyFormPage />
                        </AdminRoute >
                    }
                />

                {/* Rotas de Gestão de Vendas */}
                <Route
                    path="/admin/vendas/dashboard"
                    element={
                        <AdminRoute>
                            <SalesDashboardPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/vendas/relatorio"
                    element={
                        <AdminRoute>
                            <SalesReportPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/vendas/assinaturas"
                    element={
                        <AdminRoute>
                            <ActiveSubscriptionsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/vendas/historico"
                    element={
                        <AdminRoute>
                            <PurchaseHistoryPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/produtos"
                    element={
                        <AdminRoute>
                            <ProductsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/produtos/novo"
                    element={
                        <AdminRoute>
                            <ProductFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/produtos/:id"
                    element={
                        <AdminRoute>
                            <ProductFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cupons"
                    element={
                        <AdminRoute>
                            <CouponsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cupons/novo"
                    element={
                        <AdminRoute>
                            <CouponFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/cupons/:id"
                    element={
                        <AdminRoute>
                            <CouponFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/pagamentos"
                    element={
                        <AdminRoute>
                            <PaymentSettingsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/qrcode"
                    element={
                        <AdminRoute>
                            <QrCodeGeneratorPage />
                        </AdminRoute>
                    }
                />
                {/* FAQ Routes */}
                <Route
                    path="/admin/configuracoes/faqs"
                    element={
                        <AdminRoute>
                            <FAQsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/novo"
                    element={
                        <AdminRoute>
                            <FAQFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:id"
                    element={
                        <AdminRoute>
                            <FAQFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:faqId/categorias"
                    element={
                        <AdminRoute>
                            <FAQCategoriesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:faqId/categorias/nova"
                    element={
                        <AdminRoute>
                            <FAQCategoryFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:faqId/categorias/:id"
                    element={
                        <AdminRoute>
                            <FAQCategoryFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:faqId/categorias/:categoryId/perguntas"
                    element={
                        <AdminRoute>
                            <FAQQuestionsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:faqId/categorias/:categoryId/perguntas/nova"
                    element={
                        <AdminRoute>
                            <FAQQuestionFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/configuracoes/faqs/:faqId/categorias/:categoryId/perguntas/:id"
                    element={
                        <AdminRoute>
                            <FAQQuestionFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/seo"
                    element={
                        <AdminRoute>
                            <SEOManagementPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/seo/:type/:id"
                    element={
                        <AdminRoute>
                            <SEOFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/seo/dynamic/:entityType/:entityId"
                    element={
                        <AdminRoute>
                            <SEOFormPage />
                        </AdminRoute>
                    }
                />

                {/* Rotas de Administração de Afiliados */}
                <Route
                    path="/admin/afiliados"
                    element={
                        <AdminRoute>
                            <AdminAffiliatesPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/afiliados/saques"
                    element={
                        <AdminRoute>
                            <AdminWithdrawalsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/afiliados/faturamento"
                    element={
                        <AdminRoute>
                            <AdminAffiliateBillingPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/afiliados/:id"
                    element={
                        <AdminRoute>
                            <AdminAffiliateDetailsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/gestao-afiliados"
                    element={
                        <AdminRoute>
                            <AdminManageAffiliatesPage />
                        </AdminRoute>
                    }
                />

                {/* Rotas do Painel de Afiliados (usuários) */}
                <Route
                    path="/afiliado/produtos"
                    element={
                        <ProtectedRoute>
                            <AffiliateProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/afiliado/minhas-afiliacoes"
                    element={
                        <ProtectedRoute>
                            <MyAffiliationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/afiliado/financeiro"
                    element={
                        <ProtectedRoute>
                            <AffiliateFinancialPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/afiliado/dados-pagamento"
                    element={
                        <ProtectedRoute>
                            <AffiliatePaymentSettingsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Rotas de Checkout */}
                {/* Checkout Público (sem login) */}
                <Route
                    path="/checkoutp/:id"
                    element={<PublicCheckoutPage />}
                />
                <Route
                    path="/checkoutp/success"
                    element={<PublicCheckoutSuccessPage />}
                />
                <Route
                    path="/checkoutp/cancel"
                    element={<PublicCheckoutCancelPage />}
                />

                <Route
                    path="/checkout/success"
                    element={
                        <ProtectedRoute>
                            <CheckoutSuccessPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout/cancel"
                    element={
                        <ProtectedRoute>
                            <CheckoutCancelPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout/:id"
                    element={
                        <ProtectedRoute>
                            <ProductCheckoutPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/landing-page-comunidade"
                    element={<CommunityLandingPage />}
                />

                <Route
                    path="/"
                    element={<HomePage />}
                />
            </Routes >
        </AuthenticatedLayout>
    )
}


import { SidebarProvider } from './contexts/SidebarContext'

function App() {
    return (
        <HelmetProvider>
            <ThemeProvider>
                <AuthProvider>
                    <SidebarProvider>
                        <Router>
                            <AppRoutes />
                            <FloatingButtons />
                        </Router>
                    </SidebarProvider>
                </AuthProvider>
            </ThemeProvider>
        </HelmetProvider>
    )
}

export default App
