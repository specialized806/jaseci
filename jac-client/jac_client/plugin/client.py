from jaclang.runtimelib.machine import (
    hookimpl,
)
import types
from .vite_client_bundle import ViteClientBundleBuilder
from jaclang.runtimelib.client_bundle import ClientBundle


class JacClient:
    """Jac Client."""

    @staticmethod
    @hookimpl
    def get_client_bundle_builder() -> ViteClientBundleBuilder:
        """Get the client bundle builder instance."""
        return ViteClientBundleBuilder()

    @staticmethod
    @hookimpl
    def build_client_bundle(
        module: types.ModuleType,
        force: bool = False,
    ) -> ClientBundle:
        """Build a client bundle for the supplied module."""
        builder = JacClient.get_client_bundle_builder()
        return builder.build(module, force=force)
