import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

type NextActionProps = {
    replace?: boolean
}
export function useNextAction(props: NextActionProps = {}) {
    const navigate = useNavigate();
    const {replace = false} = props;

    const tokenRef = useRef<string | undefined>();
    const [ready, setReady] = useState(false);
    const [token, setToken] = useState<string | undefined>();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const inputToken = queryParams.get('fp_cot');
        if (inputToken) {
            setToken(inputToken);
            tokenRef.current = inputToken;
        } else {
            tokenRef.current = undefined;
        }
        setReady(true);
    }, [])

    const proceed = useCallback(async <T>(action: Promise<T>): Promise<T> => {
      const response = await action.catch((e) => ({
            "object":"error",
            "type":"api_error",
            "code":"unexpected_error",
            "message": (e as Error)?.message
        } as T));
        navigate(`/?fp_cot=${tokenRef.current || ''}`, {
            state: {response},
            replace
        });
        return response;
    }, [navigate, replace])

    return {
        ready, token, proceed
    }
}
